import { App } from './components/App';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-center justify-between py-5 px-10 bg-white dark:bg-black sm:items-start">
        <App />
      </main>
    </div>
  );
}
