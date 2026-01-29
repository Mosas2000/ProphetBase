import { ImageResponse } from 'next/og';
// Note: This API requires Next.js Edge Runtime or specific configuration

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const title = searchParams.get('title') || 'Epic Prediction Market';
    const volume = searchParams.get('vol') || '0.00';
    const yesPrice = searchParams.get('yes') || '50';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            backgroundColor: '#0052FF',
            padding: '80px',
            fontFamily: 'sans-serif',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
             <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '24px', marginRight: '24px' }}>
                <span style={{ fontSize: '48px', fontWeight: 'bold', color: '#0052FF' }}>P</span>
             </div>
             <span style={{ fontSize: '40px', fontWeight: 'bold', color: 'white', letterSpacing: '-1px' }}>
               PROPHET<span style={{ opacity: 0.7 }}>BASE</span>
             </span>
          </div>

          <div style={{ fontSize: '72px', fontWeight: '900', color: 'white', lineHeight: 1.1, marginBottom: '40px', maxWidth: '1000px' }}>
            {title}
          </div>

          <div style={{ display: 'flex', gap: '40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '24px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', fontWeight: 'bold', letterSpacing: '2px' }}>Volume</span>
              <span style={{ fontSize: '48px', color: 'white', fontWeight: '900' }}>${volume}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '24px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', fontWeight: 'bold', letterSpacing: '2px' }}>Current Odds</span>
              <span style={{ fontSize: '48px', color: '#4ade80', fontWeight: '900' }}>{yesPrice}¢ YES</span>
            </div>
          </div>

          <div style={{ position: 'absolute', bottom: '40px', right: '80px', fontSize: '24px', color: 'rgba(255,255,255,0.4)' }}>
            Join the prediction revolution • prophetbase.app
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
