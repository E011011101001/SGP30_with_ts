export default async function sleep (ms: number) {
  await new Promise<void>(r => setTimeout(_ => r(), ms))
}
