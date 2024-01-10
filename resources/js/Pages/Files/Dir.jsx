import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, Head } from '@inertiajs/react';

export default function Dir({ auth, parentDirId, files }) {
    const createFileLink = (file, index) => {
        let filename = file.filepath.split('/').at(-1);

        if (file.mimetype === 'dir') {
            filename += '/';
        }
        
        return (
            <Link
                   className="bg-slate-300 border border-blue-500 rounded-sm p-2 text-cyan-700 hover:border-transparent hover:bg-gray-700 hover:text-white"
                   href={route('files.show', file.id)} key={index+1}
            >
                {filename}
            </Link>
        );
    };
    
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Your files</h2>}
        >
            <Head title="Your files " />
            <div className="flex items-center justify-between flex-col p-4 h-auto">
                <p>Hi {auth.user.name}.</p>
                <div className="flex justify-around bg-gray-200 w-11/12 p-4 rounded-md">
                    { parentDirId != 0 &&
                        <Link
                            className="bg-slate-300 border border-blue-500 rounded-sm p-2 text-cyan-700 hover:border-transparent hover:bg-gray-700 hover:text-white"
                            href={route('files.show', parentDirId)} key="0"
                        >
                            ..
                        </Link>
                    }
                    {
                        files.map(createFileLink)
                    }
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
