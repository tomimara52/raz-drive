import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Dir({ auth, dirId, parentDirId, files, errors }) {
    const [ deleteMode, setDeleteMode ] = useState(false);
    const [ toDeleteFiles, setToDeleteFiles ] = useState([]);

    const { flash } = usePage().props;

    const handleFileDeleteButton = (fileId, fileSelectedToDelete) => {
        if (fileSelectedToDelete) {
            setToDeleteFiles(toDeleteFiles.filter((id) => id !== fileId));
        } else {
            setToDeleteFiles([ ...toDeleteFiles, fileId ]);
        }
    }

    const handleDeleteButton = () => {
        if (deleteMode) {
            setDeleteMode(false);
            setToDeleteFiles([]);
            router.post(route('files.massDestroy'), {
                data: {
                    dirId: dirId,
                    files: toDeleteFiles
                }
            });
        } else {
            setDeleteMode(true);
        }
    }
    
    const createFileLink = (file, index) => {
        let filename = file.filepath.split('/').at(-1);
        let svg;

        if (file.mimetype === 'dir') {
            filename += '/';
            svg = <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-folder" viewBox="0 0 16 16">
                <path d="M.54 3.87.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a2 2 0 0 1 .342-1.31zM2.19 4a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4zm4.69-1.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139q.323-.119.684-.12h5.396z"/>
            </svg>
        } else if (file.mimetype.startsWith('text')) {
            svg = <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-file-earmark-text" viewBox="0 0 16 16">
                <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/>
                <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
            </svg>
        } else if (file.mimetype.startsWith('image')) {
            svg = <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-file-image" viewBox="0 0 16 16">
              <path d="M8.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
              <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v8l-2.083-2.083a.5.5 0 0 0-.76.063L8 11 5.835 9.7a.5.5 0 0 0-.611.076L3 12z"/>
          </svg>
        }

        if (deleteMode) {
            const fileSelectedToDelete = toDeleteFiles.includes(file.id);
            const color = fileSelectedToDelete ? "border-red-500 text-red-700 bg-gray-300" : "border-blue-500 text-cyan-700 bg-slate-300";
            return (
                <button
                    className={ color + " border rounded p-2 flex flex-col items-center hover:border-transparent hover:bg-gray-700 hover:text-white" }
                    onClick={() => handleFileDeleteButton(file.id, fileSelectedToDelete)}
                    key={index+1}
                >
                    {svg}
                    {filename}
                </button>
            );
        }
        
        return (
            <Link
                className="bg-slate-300 border border-blue-500 rounded text-cyan-700 p-2 flex flex-col items-center hover:border-transparent hover:bg-gray-700 hover:text-white"
                href={route('files.show', file.id)} key={index+1}
            >
                {svg}
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
                { deleteMode
                  ? <p>Select the files you want to delete.</p>
                  : <p>Hi {auth.user.name}.</p>
                }
                <div className={ (deleteMode ? "bg-red-200" : "bg-gray-200") + " flex flex-wrap gap-4 w-11/12 p-4 rounded-md m-2" }>
                    { parentDirId != 0 && !deleteMode &&
                        <Link
                            className="bg-slate-300 border border-blue-500 rounded text-cyan-700 p-2 flex flex-col items-center hover:border-transparent hover:bg-gray-700 hover:text-white"
                            href={route('files.show', parentDirId)} key="0"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-folder" viewBox="0 0 16 16">
                            <path d="M.54 3.87.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a2 2 0 0 1 .342-1.31zM2.19 4a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4zm4.69-1.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139q.323-.119.684-.12h5.396z"/>
                          </svg>
                          ..
                        </Link>
                    }
                    {
                        files.map(createFileLink)
                    }
                </div>
                <div className="flex wrap">
                    <Link
                        className="mx-1 bg-green-200 border border-green-500 rounded text-green-700 p-2 hover:border-transparent hover:bg-green-800 hover:text-white"
                        href={route('files.create', dirId)} 
                    >
                        Add file
                    </Link>

                    <button
                        className="mx-1 bg-red-300 border border-red-500 rounded text-red-700 p-2 hover:border-transparent hover:bg-gray-700 hover:text-white"
                        onClick={handleDeleteButton}
                    >
                        { deleteMode ? "Confirm delete" : "Delete files" }
                    </button>
                </div>
                { flash.error &&
                <p className="text-sm text-red-700">
                    {flash.error}
                </p>
                }

            </div>
        </AuthenticatedLayout>
    );
}
