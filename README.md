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

The application includes an AI-powered chat widget that helps customers find menu options by asking natural language questions.

### How to Use

1. **Enable the Feature**: Set `NEXT_PUBLIC_AI_CHAT_ENABLED=true` in your environment variables
2. **Chat Button**: A floating circular button with a chat icon appears in the bottom-right corner of customer-facing menu pages
3. **Opening the Modal**: Click the chat button to open the AI chat interface
4. **Ask Questions**: Type questions like "¿qué puedo comer?" or "¿tienen opciones veganas?"
5. **View References**: The AI will respond with suggestions and provide clickable links to specific products
6. **Session Only**: Conversations are kept in memory during the session and are not persisted

### Configuration

**Environment Variables:**

- `NEXT_PUBLIC_AI_CHAT_ENABLED`: Set to `true` to enable the AI chat widget, `false` or leave unset to disable
- `NEXT_PUBLIC_API_URL`: The base URL for the backend API (e.g., `http://localhost:3000`)
- `NEXT_PUBLIC_AI_CHAT_LOGS`: (Optional) Set to `true` to enable console logging for debugging

**Example .env configuration:**
```bash
NEXT_PUBLIC_AI_CHAT_ENABLED=true
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_AI_CHAT_LOGS=false
```

### API Integration

The AI chat widget sends POST requests to the `/ai/chat` endpoint with the following format:

**Request:**
```json
{
  "question": "¿qué puedo comer?",
  "conversation_history": [
    {
      "role": "user",
      "content": "previous question"
    },
    {
      "role": "assistant",
      "content": "previous answer"
    }
  ],
  "top_k": 5,
  "locale": "es"
}
```

**Expected Response:**
```json
{
  "answer": "Te recomiendo estas opciones...",
  "references": [
    {
      "product_id": "123",
      "name": "Pizza Margherita",
      "relevance_score": 0.95
    }
  ]
}
```

### Testing the Feature Manually

1. Set the environment variables:
   ```bash
   export NEXT_PUBLIC_AI_CHAT_ENABLED=true
   export NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Navigate to a restaurant menu page (e.g., `http://localhost:3001/restaurant-name`)

4. Click the AI chat button in the bottom-right corner

5. Test with questions like:
   - "¿qué puedo comer?"
   - "¿tienen opciones veganas?"
   - "¿qué postres tienen?"

### Testing with curl

You can test the backend endpoint directly:

```bash
curl -X POST http://localhost:3000/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "question": "¿qué puedo comer?",
    "top_k": 5,
    "locale": "es"
  }'
```

**Note:** The backend must have the `FEATURE_AI_CHAT_ENABLED` flag enabled. Refer to the backend repository (gonzabt3/qr-menu) for configuration details.

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
