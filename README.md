# Next.js Hello World


This example shows the most basic idea behind Next. We have 2 pages: `src/pages/index.js` and `src/pages/about.js`. The former responds to `/` requests and the latter to `/about`. Using `next/link` you can add hyperlinks between them with universal routing capabilities.

The app in this repo is deployed at https://next-js.onrender.com.

## Feedback Feature

The application includes a user feedback system that allows users to send feedback from any page.

### How to Use

1. **Feedback Button**: A floating circular button with a chat icon is located in the bottom-left corner of every page.
2. **Opening the Modal**: Click the feedback button to open the feedback modal.
3. **Submitting Feedback**: 
   - Enter your feedback in the text area
   - Click "Enviar" to submit
   - You can also use Ctrl+Enter (or Cmd+Enter on Mac) to submit
4. **Closing the Modal**: Click "Cerrar" button, the X button, press ESC key, or click outside the modal

### API Integration

The feedback feature sends a POST request to the `/feedbacks` endpoint with the following format:

**Request:**
```json
{
  "message": "User feedback text here"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Feedback received"
}
```

**Configuration:**

The API endpoint URL is configured via the `NEXT_PUBLIC_API_SERVER_URL` environment variable. If not set, it defaults to `http://localhost:3000`.

### Testing the Feature Manually

1. Start the development server: `npm run dev`
2. Navigate to any page in the application
3. Click the feedback button in the bottom-left corner
4. Enter some feedback text
5. Click "Enviar" to test the submission

**Note:** Make sure the backend API endpoint is properly configured and running to receive feedback submissions.

## AI Chat Widget Feature

The application includes an AI-powered chat widget that allows customers to ask questions about the menu and receive intelligent responses based on RAG (Retrieval-Augmented Generation) from the backend.

### How to Enable

The AI chat widget is **disabled by default**. To enable it, set the following environment variable:

```bash
NEXT_PUBLIC_AI_CHAT_ENABLED=true
```

Add this to your `.env.local` file for local development or configure it in your deployment environment.

### How to Use

1. **Chat Widget Button**: When enabled, a floating purple robot icon button appears in the bottom-right corner on menu pages.
2. **Opening the Chat**: Click the robot button to open the chat modal.
3. **Asking Questions**: 
   - Type your question in the input field (e.g., "¿Qué puedo comer?", "¿Tienen opciones vegetarianas?")
   - Press Enter or click "Enviar" to submit
   - The AI will respond with relevant information from the menu
4. **Product References**: If the AI mentions specific products, you'll see clickable reference buttons that link to those products.
5. **Chat History**: The conversation is maintained during your session but is not persisted between page reloads.
6. **Clearing Chat**: Click "Limpiar conversación" to start a fresh conversation.

### API Integration

The chat widget sends a POST request to the `/chat` endpoint with the following format:

**Request:**
```json
{
  "user_query": "¿Qué puedo comer?",
  "locale": "es",
  "topK": 5
}
```

**Expected Response:**
```json
{
  "answer": "Tenemos varias opciones deliciosas...",
  "references": [
    {
      "product_id": "123",
      "product_name": "Pizza Margherita",
      "score": 0.95
    }
  ]
}
```

**Configuration:**

- The API endpoint URL is configured via `NEXT_PUBLIC_API_URL` (preferred) or `NEXT_PUBLIC_API_SERVER_URL`.
- If not set, it defaults to `http://localhost:3000`.
- For cross-origin API requests, ensure CORS is properly configured on the backend.

### Testing the Feature Manually

1. Enable the feature:
   ```bash
   echo "NEXT_PUBLIC_AI_CHAT_ENABLED=true" >> .env.local
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Navigate to a menu page (e.g., `/restaurant/[id]/menu/[menuId]`)

4. Click the purple robot icon in the bottom-right corner

5. Try asking questions like:
   - "¿Qué puedo comer?"
   - "¿Tienen opciones vegetarianas?"
   - "¿Cuál es el plato más popular?"

**Note:** Make sure the backend API with the `/chat` endpoint is properly configured and running to receive chat requests. The backend should implement RAG functionality to provide intelligent responses.

### Privacy Notice

The chat widget displays a privacy disclaimer informing users that "Las preguntas pueden ser analizadas para mejorar el servicio" (Questions may be analyzed to improve the service).

## Deploy as Node Web Service

Click the button below to deploy this app on Render.

<a href="https://render.com/deploy" referrerpolicy="no-referrer-when-downgrade" rel="nofollow">
  <img src="https://render.com/images/deploy-to-render-button.svg" alt="Deploy to Render" />
</a>

## Deploy as Static Site

1. Modify the code:
    1. In `render.yaml`, replace the definition of the service named `next-js` with the definition that is commented out.
    2. In `next.config.mjs`, uncomment the line that sets `output: "export"`.

2. Commit the code changes to your repository.

3. Click the Deploy to Render button.
