import { NextResponse } from 'next/server';

export async function GET() {
    const res = await fetch('https://api.github.com/repos/vercel/next.js');
    const repo = await res.json();

    return NextResponse.json(repo);
}