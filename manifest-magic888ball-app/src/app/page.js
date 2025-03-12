import EightBall from './components/MainPage';

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-[url('/space-background.png')] bg-cover bg-center bg-no-repeat overflow-y-auto">
      <EightBall />
    </main>
  );
}