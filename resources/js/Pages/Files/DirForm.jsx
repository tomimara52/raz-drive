import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import { Head, useForm, Link } from '@inertiajs/react';

export default function FileForm({ auth, dir }) {
    const { data, setData, post, errors, processing } = useForm('Dir/Create', {
        dirname: '',
    });

    function submit(e) {
        e.preventDefault();

        post(route('files.storeDir', dir.id));
    };

    
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">New directory at {dir.filepath}</h2>}
        >
            <Head title="New directory " />
            <div className="pt-8 px-16">
                <Link
                    className="bg-slate-300 border border-blue-500 rounded text-cyan-700 p-2 hover:border-transparent hover:bg-gray-700 hover:text-white"
                    href={route('files.show', dir.id)} 
                >
                    Go back
                </Link>
                <form onSubmit={submit} className="rounded bg-gray-200 py-2 px-4 max-w-min m-auto">
                    <div className="my-4">
                        <InputLabel htmlFor="dirname">Name of directory: </InputLabel>
                        <TextInput
                            id="dirname"
                            value={data.dirname}
                            onChange={e => setData('dirname', e.target.value)}
                        />
                        <InputError message={errors.dirname}></InputError>
                    </div>
                    <PrimaryButton type="submit" disabled={processing}>Submit</PrimaryButton>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
