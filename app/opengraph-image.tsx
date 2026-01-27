import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Curago – AI-utbildning'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 180,
            fontWeight: 900,
            fontFamily: 'Georgia, "Times New Roman", serif',
            letterSpacing: '-4px',
          }}
        >
          <span style={{ color: '#1a1a1a' }}>Cura</span>
          <span style={{ color: '#0477d1' }}>go</span>
        </div>
      </div>
    ),
    {
      ...size,
    },
  )
}
