<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Models\Log;
use Illuminate\Http\Request;
use Inertia\Inertia;

use \Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Files/Dir', [
            'files' => File::where('parent_dir', 1)->get(),
            'dirId' => 1,
            'parentDirId' => 0
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(File $dir)
    {
        abort_if($dir->mimetype != 'dir', 404);

        return Inertia::render('Files/FileForm', [
            'dir' => $dir,
            'warn' => false
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, File $dir)
    {
        abort_if($dir->mimetype != 'dir', 404);

        $request->validate([
            'filename' => 'required',
            'file' => 'required'
        ]);

        $newFilePath = $dir->filepath . ($dir->id == 1 ? '' : '/') . $request->filename;

        $fileExists = !File::where('filepath', $newFilePath)->get()->isEmpty();

        if (!$request->acceptedRisk && $fileExists) {
            return Inertia::render('Files/FileForm', [
                'dir' => $dir,
                'warn' => true
            ]);
        } else if ($request->acceptedRisk && $fileExists) {
            File::where('filepath', $newFilePath)->delete();
        }

        $newFile = File::create([
            'filepath' => $newFilePath,
            'parent_dir' => $dir->id,
            'size' => $request->file->getSize(),
            'mimetype' => $request->file->getMimeType()
        ]);
            

        Storage::putFileAs($dir->filepath, $request->file('file'), $request->filename);


        Log::create([
            'file_id' => $newFile->id,
            'filepath' => $newFile->filepath,
            'type' => 'create'
        ]);

        return redirect()->route('files.show', $dir->id);
    }

    public function createDir(File $dir)
    {
        abort_if($dir->mimetype != 'dir', 404);

        return Inertia::render('Files/DirForm', [
            'dir' => $dir
        ]);
    }

    public function storeDir(Request $request, File $dir)
    {
        abort_if($dir->mimetype != 'dir', 404);

        $request->validate([
            'dirname' => 'required'
        ]);

        $newDirPath = $dir->filepath . ($dir->id == 1 ? '' : '/') . $request->dirname;

        $dirExists = !File::where('filepath', $newDirPath)->get()->isEmpty();

        if ($dirExists) {
            $errorMsg = 'There already exists a directory with that name.';

            return redirect()->route('files.createDir', $dir->id)->with('error', $errorMsg);
        }

        Storage::makeDirectory($newDirPath);

        $newDir = File::create([
            'filepath' => $newDirPath,
            'parent_dir' => $dir->id,
            'size' => 4096,
            'mimetype' => 'dir'
        ]);

        Log::create([
            'file_id' => $newDir->id,
            'filepath' => $newDir->filepath,
            'type' => 'create'
        ]);

        return redirect()->route('files.show', $dir->id);
    }

    /**
     * Display the specified resource.
     */
    public function show(File $file)
    {
        $content = '';

        if (str_starts_with($file->mimetype, 'text')) {
            $content = Storage::get($file->filepath);
        } else if ($file->mimetype == 'dir') {
            return Inertia::render('Files/Dir', [
                'files' => $file->files,
                'dirId' => $file->id,
                'parentDirId' => $file->parent_dir
            ]);
        }

        return Inertia::render('Files/Show', [
            'file' => $file,
            'content' => $content
        ]);
    }

    public function raw(File $file)
    {
        return response()->file(storage_path().'/app/'.$file->filepath);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(File $file)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, File $file)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(File $file)
    {
        if ($file->id == 1 || ($file->mimetype == 'dir' && !$file->files->isEmpty())) {
            abort(403);
        }

        $parentDir = $file->parentDir;

        Log::create([
            'file_id' => $file->id,
            'filepath' => $file->filepath,
            'type' => 'delete'
        ]);

        Storage::delete($file->filepath);
        File::where('id', $file->id)->delete();

        return redirect()->route('files.show', $parentDir->id);
    }

    public function massDestroy(Request $request)
    {
        $filesSelected = File::whereIn('id', $request->data['files'])->get();
        $notEmptyDirs = false;
        
        foreach ($filesSelected as $file) {
            if ($file->mimetype != 'dir') {
                Log::create([
                    'file_id' => $file->id,
                    'filepath' => $file->filepath,
                    'type' => 'delete'
                ]);

                Storage::delete($file->filepath);
                $file->delete();
            } else if ($file->id != 1) {
                if ($file->files->isEmpty()) {
                    Log::create([
                        'file_id' => $file->id,
                        'filepath' => $file->filepath,
                        'type' => 'delete'
                    ]);

                    Storage::deleteDirectory($file->filepath);
                    $file->delete();
                } else {
                    $notEmptyDirs = true;
                }
            }
        }

        $dirId = $request->data['dirId'];

        if ($notEmptyDirs) {
            $errorMsg = 'You can\'t delete directories that aren\'t empty.';

            if ($dirId == 1) {
                return redirect()->route('files.all')->with('error', $errorMsg);
            } 

            return redirect()->route('files.show', $dirId)->with('error', $errorMsg );
        }

        return redirect()->route('files.show', $dirId);
    }
}
