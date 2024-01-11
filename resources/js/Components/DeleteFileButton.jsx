import PrimaryButton from '@/Components/PrimaryButton';
import { router } from '@inertiajs/react';

export default function DeleteFileButton({ className='', fileId,  ...props }) {
    const submit = e => {
        e.preventDefault();

        router.post(route('files.destroy', fileId));
    }

    return <div {...props} className={className}>
        <form onSubmit={submit}>
            <input type="number" hidden readOnly value={fileId}/>
            <PrimaryButton type="submit" disabled={false}>Delete file</PrimaryButton>
        </form>
    </div>;
}
