import { NextApiRequest, NextApiResponse } from 'next';
import { auth0 } from '../../../../lib/auth0';

// Mock data for when BACKEND_URL is not configured
const mockData = {
  users: [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      createdAt: '2024-01-15T10:30:00Z',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'user',
      createdAt: '2024-02-20T14:45:00Z',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'user',
      createdAt: '2024-03-10T09:15:00Z',
    },
  ],
  restaurants: [
    {
      id: 1,
      name: 'La Trattoria',
      address: 'Calle Principal 123',
      cuisine: 'Italian',
      rating: 4.5,
      status: 'active',
      createdAt: '2024-01-10T12:00:00Z',
    },
    {
      id: 2,
      name: 'El Asador',
      address: 'Av. Libertador 456',
      cuisine: 'Steakhouse',
      rating: 4.8,
      status: 'active',
      createdAt: '2024-02-05T15:30:00Z',
    },
    {
      id: 3,
      name: 'Sushi Bar',
      address: 'Centro Comercial 789',
      cuisine: 'Japanese',
      rating: 4.3,
      status: 'pending',
      createdAt: '2024-03-15T11:20:00Z',
    },
  ],
  feedback: [
    {
      id: 1,
      message: 'Great application! Very easy to use.',
      rating: 5,
      userName: 'Alice Brown',
      createdAt: '2024-03-01T10:00:00Z',
      status: 'reviewed',
    },
    {
      id: 2,
      message: 'Could use more features for menu customization.',
      rating: 4,
      userName: 'Charlie Davis',
      createdAt: '2024-03-05T14:30:00Z',
      status: 'pending',
    },
    {
      id: 3,
      message: 'The QR code generation is fantastic!',
      rating: 5,
      userName: 'Diana Evans',
      createdAt: '2024-03-10T09:45:00Z',
      status: 'reviewed',
    },
    {
      id: 4,
      message: 'Had some issues with the mobile view.',
      rating: 3,
      userName: 'Frank Green',
      createdAt: '2024-03-12T16:20:00Z',
      status: 'pending',
    },
  ],
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify Auth0 session
    const session = await auth0.getSession(req);

    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized - No valid session' });
    }

    // Check if user email is in ADMIN_EMAILS
    const adminEmails = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);

    const userEmail = (session.user.email || '').toLowerCase();

    if (!adminEmails.includes(userEmail)) {
      return res.status(403).json({ error: 'Forbidden - User not authorized as admin' });
    }

    // Get the data type from query params
    const { type, ...otherParams } = req.query;

    if (!type || typeof type !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid "type" parameter' });
    }

    const validTypes = ['users', 'restaurants', 'feedback'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        error: `Invalid type. Must be one of: ${validTypes.join(', ')}` 
      });
    }

    const backendUrl = process.env.BACKEND_URL;

    // If BACKEND_URL is configured, proxy the request
    if (backendUrl) {
      try {
        // Build query string from remaining params - handle both string and string[] values
        const queryParams = new URLSearchParams();
        Object.entries(otherParams).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach(v => queryParams.append(key, String(v)));
          } else if (value) {
            queryParams.append(key, String(value));
          }
        });
        const queryString = queryParams.toString();
        const targetUrl = `${backendUrl}/admin/${type}${queryString ? `?${queryString}` : ''}`;

        // Include user email in header for backend authorization
        const response = await fetch(targetUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Admin-Email': userEmail,
            'X-User-Email': userEmail,
          },
        });

        if (!response.ok) {
          throw new Error(`Backend responded with status ${response.status}`);
        }

        const data = await response.json();
        return res.status(200).json(data);
      } catch (error: any) {
        console.error('Error proxying to backend:', error);
        return res.status(502).json({ 
          error: 'Error connecting to backend'
        });
      }
    }

    // If no BACKEND_URL, return mock data
    const dataType = type as keyof typeof mockData;
    return res.status(200).json({
      data: mockData[dataType],
      _mock: true,
      _message: 'Using mock data (BACKEND_URL not configured)',
    });

  } catch (error: any) {
    console.error('Error in admin data API:', error);
    return res.status(500).json({ 
      error: 'Internal server error'
    });
  }
}
