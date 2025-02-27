import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom', 'react-redux'],
          'vendor-ui': ['@material-tailwind/react', '@heroicons/react'],
          
          // Feature chunks
          'feature-auth': ['./src/features/auth/LoginPage.jsx'],
          'feature-dashboard': ['./src/features/dashboard/Dashboard.jsx'],
          'feature-tenants': [
            './src/features/tenants/TenantListB.jsx',
            './src/features/tenants/AddTenant.jsx',
            './src/features/tenants/EditTenant.jsx',
            './src/features/tenants/TenantDetails.jsx'
          ],
          'feature-rooms': [
            './src/features/rooms/RoomList.jsx',
            './src/features/rooms/AddRoom.jsx',
            './src/features/rooms/RoomDetail.jsx',
            './src/features/rooms/EditRoom.jsx'
          ],
          'feature-payments': ['./src/features/payments/PaymentPage.jsx'],
          'feature-readings': [
            './src/features/readings/ReadingList.jsx',
            './src/features/readings/AddReading.jsx',
            './src/features/readings/ReadingDetails.jsx'
          ],
          'feature-rent': ['./src/components/RentCollection/RentCollectionList.jsx']
        }
      }
    }
  }
}) 