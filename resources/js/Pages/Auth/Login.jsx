import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: true,
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('login'));
  };

  return (
    <GuestLayout>
      <Head title="ログイン" />

      {status && (
        <div className="mb-4 text-sm font-medium text-green-600">{status}</div>
      )}

      <form onSubmit={submit} className="w-full max-w-[320px] mx-auto">
        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm mb-1 text-text">
            メール
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
            className="w-full h-12 px-4 rounded-full border border-main/40 outline-none"
            autoComplete="username"
            required
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm mb-1 text-text">
            パスワード
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={data.password}
            onChange={(e) => setData('password', e.target.value)} 
            className="w-full h-12 px-4 rounded-full border border-main/40 outline-none"
            autoComplete="current-password"
            required
          />
          {errors.password && (
            <p className="text-sm text-red-600 mt-1">{errors.password}</p>
          )}
        </div>

        {/* Remember（必要なら） */}
        {/* 
        <label className="flex items-center gap-2 text-sm mb-4">
          <input
            type="checkbox"
            checked={data.remember}
            onChange={(e) => setData('remember', e.target.checked)}
            className="rounded text-main focus:ring-main/40"
          />
          ログイン状態を保持
        </label>
        */}

        <button
          type="submit"
          disabled={processing}
          className="w-full h-12 mt-4 rounded-full bg-main text-white font-semibold disabled:opacity-60"
        >
          ログイン
        </button>

        <div className="text-right mt-2">
          <Link href={route('register')} className="text-sm text-accent hover:underline">
            新規登録はこちら
          </Link>
        </div>
      </form>
    </GuestLayout>
  );
}
