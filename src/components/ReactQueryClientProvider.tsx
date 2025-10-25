'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

const queryCliente = new QueryClient()

const ReactQueryClientProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <QueryClientProvider client={queryCliente}>
            {children}
        </QueryClientProvider>
    )
}

export default ReactQueryClientProvider