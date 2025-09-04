import prisma from '@sbr/database/client';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e?.message }), { status: 500 });
  }
}
