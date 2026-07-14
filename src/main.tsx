import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { DiamondDSTheme, ThemeProvider } from '@diamondlightsource/sci-react-ui'
import { RouterProvider } from 'react-router-dom'
import { router } from './router.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={DiamondDSTheme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
