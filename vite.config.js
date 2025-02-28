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
          'feature-auth': ['./src/modules/auth/LoginPage.jsx'],
          'feature-dashboard': ['./src/modules/dashboard/Dashboard.jsx'],
          'feature-tenants': [
            './src/modules/tenants/TenantListB.jsx',
            './src/modules/tenants/AddTenant.jsx',
            './src/modules/tenants/EditTenant.jsx',
            './src/modules/tenants/TenantDetails.jsx'
          ],
          'feature-rooms': [
            './src/modules/rooms/RoomList.jsx',
            './src/modules/rooms/AddRoom.jsx',
            './src/modules/rooms/RoomDetail.jsx',
            './src/modules/rooms/EditRoom.jsx'
          ],
          'feature-payments': ['./src/modules/payments/PaymentPage.jsx'],
          'feature-readings': [
            './src/modules/readings/ReadingList.jsx',
            './src/modules/readings/AddReading.jsx',
            './src/modules/readings/ReadingDetails.jsx'
          ],
          'feature-rent': ['./src/modules/rent/RentCollectionList']
        }
      }
    }
  }
}) 