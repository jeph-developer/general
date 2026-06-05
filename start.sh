#!/bin/bash
echo "=== Starting SMS Application ==="

# Start backend
echo "Starting backend on port 5000..."
cd backend && node server.js &
BACKEND_PID=$!
sleep 2

# Verify backend is running
if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
  echo "Backend is running!"
else
  echo "Failed to start backend. Check if MySQL is running (LAMPP)."
  exit 1
fi

# Start frontend
echo "Starting frontend on port 5173..."
cd ../frontend && npx vite --host &
FRONTEND_PID=$!
sleep 3

echo ""
echo "===================================="
echo " SMS Application is ready!"
echo " Frontend: http://localhost:5173"
echo " Backend:  http://localhost:5000"
echo "===================================="
echo ""
echo "Login credentials:"
echo "  Username: admin"
echo "  Password: admin123"
echo ""
echo "Press Ctrl+C to stop both servers."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM
wait
