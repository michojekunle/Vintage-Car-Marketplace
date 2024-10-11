import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getYears');
    const text = await response.text();
    
    const jsonStr = text.match(/\?+\((.*)\)/)?.[1];
    
    if (!jsonStr) {
      throw new Error('Invalid JSONP response');
    }
    
    const data = JSON.parse(jsonStr);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching car data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch car data' },
      { status: 500 }
    );
  }
}