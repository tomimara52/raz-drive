import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import { Head, useForm, Link } from '@inertiajs/react';
import { useEffect } from 'react';

export default function FileForm({ auth, dir, warn }) {
    const { data, setData, post, processing, progress, errors, clearErrors, reset } = useForm('File/Create', {
        filename: '',
        file: null,
        acceptedRisk: false
    });

    useEffect(() => {
        if (data.acceptedRisk) {
            post(route('files.store', dir.id));
        }
    }, [ data.acceptedRisk ]);

    function submit(e) {
        e.preventDefault()

        post(route('files.store', dir.id), {
            preserveScroll: true
        });
    };

    const handleButtonNo = () => {
        clearErrors();
        reset('filename');
    }

    const handleButtonYes = () => {
        clearErrors();
        setData('acceptedRisk', true);
    }
    
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">New file at {dir.filepath}</h2>}
        >
            <Head title="New file " />
            <div className="pt-8 px-16">
                <Link
                    className="bg-slate-300 border border-blue-500 rounded text-cyan-700 p-2 hover:border-transparent hover:bg-gray-700 hover:text-white"
                    href={route('files.show', dir.id)} 
                >
                    Go back
                </Link>
                <form onSubmit={submit} className="rounded bg-gray-200 py-2 px-4 max-w-min m-auto">
                    <div className="my-4">
                        <InputLabel htmlFor="filename">Filename: </InputLabel>
                        <TextInput
                            id="filename"
                            value={data.filename}
                            onChange={e => setData('filename', e.target.value)}
                        />
                        <InputError message={errors.filename}></InputError>
                    </div>
                    <div className="my-4">
                        <InputLabel htmlFor="file">File: </InputLabel>
                        <input
                            id="file"
                            type="file"
                            onChange={e => setData('file', e.target.files[0])}
                            className="block font-medium text-sm text-gray-700"
                        />
                        {progress && (!warn || data.acceptedRisk) && (
                            <progress value={progress.percentage} max="100">
                                {progress.percentage}%
                            </progress>
                        )}
                        <InputError message={errors.file}></InputError>
                    </div>
                    { (warn && !data.acceptedRisk) ? <>
                        <p className="text-sm text-red-600 text-center">There already exists a file with that name. Do you want to overwrite it?</p> 
                        <div className="flex justify-between m-2">
                            <PrimaryButton onClick={handleButtonYes}>Yes</PrimaryButton>
                            <PrimaryButton onClick={handleButtonNo}>No</PrimaryButton>
                        </div>
                    </>
                      :
                        <PrimaryButton type="submit" disabled={processing}>Submit</PrimaryButton>
                    }
                </form>
                </div>
        </AuthenticatedLayout>
    );
}
