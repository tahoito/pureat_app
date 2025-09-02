import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
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
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                {/* Email */}
                <div htmlFor="email" className="mb-4">
                    <label className="block text-sm mb-0 text-text">メール</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={(e) => setData("email",e.target.value)}
                        className="w-full h-12 px-4 
                            rounded-full 
                            border border-main/40 
                            outline-none
                        "
                        autoComplete="username"
                        placeholder=""
                        isFocused={true}
                    />

                    {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm mb-0 text-text">パスワード</label>
                        <input 
                            id="password"
                            type="password"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                            className="w-full h-12 
                            px-4 rounded-full 
                            border border-main/40 
                            outline-none"
                            autoComplete="current-password"
                            required
                        />
                    {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}        
                </div>

                <button 
                type="submit"
                disabled={processing}
                className="w-full h-12 
                mt-4
                rounded-full 
                bg-main text-white font-semibold 
                disabled:opacity-60"
                >
                    ログイン
                </button>  

                <div className="text-right">
                    <Link
                        href={route("register")}
                        className="text-sm text-accent hover:underline"
                    >
                        新規登録はこちら
                    </Link>
                </div>

            </form>
        </GuestLayout>
    );

}
