import { NextResponse } from 'next/server'
import { FINNHUB_API_KEY } from '@/lib/utils'

export async function GET(request: Request) {

  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get('symbol')

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol parameter is required' }, { status: 400 })
  }
  if (!FINNHUB_API_KEY) {
    return NextResponse.json({ error: 'API key not found' }, { status: 500 })
  }

  const url = new URL('https://finnhub.io/api/v1/stock/profile2')
  url.searchParams.append('symbol', symbol)
  url.searchParams.append('token', FINNHUB_API_KEY)

  try {
    const response = await fetch(url.toString())
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Failed to fetch company data' }, { status: 500 })
  }
}

