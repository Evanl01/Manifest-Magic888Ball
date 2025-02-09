import EightBall from './components/EightBall';

export default function Home() {
  return (
    <main className="h-screen w-full bg-[url('/space-background.png')] bg-cover bg-center bg-no-repeat overflow-hidden">
      <EightBall />
    </main>
  );
}