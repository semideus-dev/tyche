import { NextResponse } from 'next/server'
import { FINNHUB_API_KEY } from '@/lib/utils'


export async function GET() {
  
  if (!FINNHUB_API_KEY) {
    return NextResponse.json({ error: 'API key not found' }, { status: 500 })
  }
  const url = new URL('https://finnhub.io/api/v1/stock/symbol')
  url.searchParams.append('exchange', 'US')
  url.searchParams.append('token', FINNHUB_API_KEY)

  try {
    const response = await fetch(url.toString())
    const data = await response.json()
    return NextResponse.json(data.slice(0, 20)) // Limiting to 20 companies for performance
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 })
  }
}

