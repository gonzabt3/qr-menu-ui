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

The feedback feature sends a POST request to the `/api/feedback` endpoint with the following format:

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
