import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { email, name } = await request.json();

  if (!email) {
    return NextResponse.json(
      { error: 'Email is required' },
      { status: 400 }
    );
  }

  try {
    // Listmonk API endpoint
    const listmonkURL = process.env.LISTMONK_URL;
    const listmonkUser = process.env.LISTMONK_USER;
    const listmonkPass = process.env.LISTMONK_PASS;
    const listId = process.env.LISTMONK_LIST_ID || '1';

    const auth = Buffer.from(`${listmonkUser}:${listmonkPass}`).toString('base64');

    const response = await fetch(`${listmonkURL}/api/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify({
        email,
        name: name || '',
        lists: [parseInt(listId)],
        status: 'enabled',
        preconfirm_subscriptions: false, // Set to true to skip double opt-in
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to subscribe' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed! Check your email for confirmation.'
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
