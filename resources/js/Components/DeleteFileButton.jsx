import PrimaryButton from '@/Components/PrimaryButton';
import { router } from '@inertiajs/react';

export default function DeleteFileButton({ buttonClassName='', className='', fileName, fileId,  ...props }) {
    const submit = e => {
        e.preventDefault();

        if (window.confirm(`Are you sure you want to delete ${fileName}?`))
            router.post(route('files.destroy', fileId));
    }

    return <div {...props} className={className}>
        <form onSubmit={submit}>
            <input type="number" hidden readOnly value={fileId}/>
            <PrimaryButton className={buttonClassName} type="submit" disabled={false}>Delete file</PrimaryButton>
        </form>
    </div>;
}
