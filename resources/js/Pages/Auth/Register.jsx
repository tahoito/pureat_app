import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="新規登録" />

            <form onSubmit={submit}>
                <div className="mt-4">
                    <label htmlFor="email" className="block text-sm mb-0 text-text">メール</label>
                    <input 
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="w-full h-12 px-4
                            rounded-full
                            border border-main/40
                            outline-none"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                </div>


                <div className="mt-4">
                    <label htmlFor="password" className="block text-sm mb-0 text-text">パスワード</label>

                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="w-full h-12 px-4
                            rounded-full
                            border border-main/40
                            outline-none"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}  
                </div>

                <div className="mt-4">
                    <label htmlFor="password_confirmation" className="block text-sm mb-0 text-text" value="Confirm Password">パスワード（確認用）</label>
                
                    <input
                        id="password_confirmations"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="w-full h-12 px-4
                            rounded-full
                            border border-main/40
                            outline-none"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    {(errors.password_confirmation || errors.password) && (
                        <p className="text-sm text-red-600 mt-1">
                            {errors.password_confirmation ?? errors.password}
                        </p>
                )}
                </div>

                <button 
                type="submit"
                disabled={processing}
                className="w-full h-12
                mt-8
                rounded-full
                bg-main text-white font-semibold
                disabled:opacity-60"
                >新規登録</button>
                
                <div className="text-right">
                    <Link
                        href={route('login')}
                        className="text-sm text-accent hover:underline"
                    >
                        ログインはこちら
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
