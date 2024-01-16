<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class File extends Model
{
    use HasFactory;

    protected $fillable = [
        'filepath',
        'parent_dir',
        'size',
        'mimetype'
    ];

    public function parentDir(): BelongsTo
    {
        return $this->belongsTo(File::class, 'parent_dir');
    }

    public function files(): HasMany
    {
        return $this->hasMany(File::class, 'parent_dir');
    }
}
