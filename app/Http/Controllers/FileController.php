<?php

namespace App\Http\Controllers;

use App\Models\File;
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

        File::create([
            'filepath' => $newFilePath,
            'parent_dir' => $dir->id,
            'size' => $request->file->getSize(),
            'mimetype' => $request->file->getMimeType()
        ]);
            

        Storage::putFileAs($dir->filepath, $request->file('file'), $request->filename);

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
                'files' => File::where('parent_dir', $file->id)->get(),
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
        //
    }
}
