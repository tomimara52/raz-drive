import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteFileButton from '@/Components/DeleteFileButton';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, file, content }) {

    function getFileDisplayer() {
        if (file.mimetype.startsWith('text')) {
            const paragraphs = content.split('\n').map((text, i) => {
                if (text == '') {
                    return <br key={i}/>;
                }

                return <p key={i}>{text}</p>;
            });

            if (content.endsWith('\n')) {
                paragraphs.pop();
            }

            return (
                <div className="flex justify-center mx-6 p-4">
                    <div className="w-5/6 bg-slate-300 p-4 rounded">
                        {paragraphs}
                    </div>
                </div>
            );
        } else if (file.mimetype.startsWith('image')) {
            return <div><img src={route('files.raw', file.id)} /></div>;
        }
    };
    
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{file.filepath}</h2>}
        >
            <Head title={file.filepath + ' '} />
            <div className="p-4 grid items-baseline" style={{gridTemplateColumns: '10% auto 10%'}}>
                <div>
                    <Link
                        className="mr-1 bg-slate-300 border border-blue-500 rounded-sm p-2 text-cyan-700 hover:border-transparent hover:bg-gray-700 hover:text-white"
                        href={route('files.show', file.parent_dir)}
                    >
                        Back
                    </Link>
                </div>
                <p><b>File type:</b> {file.mimetype}</p>
                <DeleteFileButton
                    fileName={file.filepath.split('/').at(-1)}
                    fileId={file.id}
                    className="flex justify-end"
                    buttonClassName="bg-red-300 border border-red-500 rounded-sm p-2 text-red-700 hover:border-transparent hover:bg-gray-700 hover:text-white"
                />
            </div>
            {getFileDisplayer()}
        </AuthenticatedLayout>
    );
}
