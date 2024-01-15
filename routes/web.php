<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {

    Route::get('/', [FileController::class, 'index'])->name('files.all');

    Route::redirect('/file/1', '/');
    Route::get('/file/{file}', [FileController::class, 'show'])->name('files.show');

    Route::get('/file/{dir}/new-file', [FileController::class, 'create'])->name('files.create');
    Route::post('/file/{dir}/new-file', [FileController::class, 'store'])->name('files.store');

    Route::get('/file/{dir}/new-dir', [FileController::class, 'createDir'])->name('files.createDir');
    Route::post('/file/{dir}/new-dir', [FileController::class, 'storeDir'])->name('files.storeDir');

    Route::post('/file/{file}/delete', [FileController::class, 'destroy'])->name('files.destroy');

    Route::post('/destroy', [FileController::class, 'massDestroy'])->name('files.massDestroy');

    Route::get('/storage/{file}', [FileController::class, 'raw'])->name('files.raw');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
