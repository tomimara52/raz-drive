import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import { Head, useForm } from '@inertiajs/react';

export default function Dir({ auth, dir, warn }) {
    const { data, setData, post, processing, progress, errors, clearErrors, reset } = useForm('File/Create', {
        filename: '',
        file: null,
        warned: false
    });


    function submit(e) {
        e.preventDefault()

        post(route('files.store', dir.id));
    };

    const handleButtonNo = () => {
        reset();
        clearErrors();
    }

    const handleButtonYes = () => {
        clearErrors();
        setData('warned', true);
    }
    
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">New file at {dir.filepath}</h2>}
        >
            <Head title="New file " />
            <div className="flex justify-center m-7">
                <form onSubmit={submit} className="rounded bg-gray-200 py-2 px-4">
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
                        {progress && (
                            <progress value={progress.percentage} max="100">
                                {progress.percentage}%
                            </progress>
                        )}
                        <InputError message={errors.file}></InputError>
                    </div>
                    { (warn && !data.warned) ? <>
                        <p className="text-md text-red-600">There already exists a file with that name. Do you want to override it?</p>
                        <PrimaryButton onClick={handleButtonYes}>Yes</PrimaryButton>
                        <PrimaryButton onClick={handleButtonNo}>No</PrimaryButton>
                    </>
                      :
                        <PrimaryButton type="submit" disabled={processing}>Submit</PrimaryButton>
                    }
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
