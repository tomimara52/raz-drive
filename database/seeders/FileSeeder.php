<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class FileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (DB::table('files')->where('id', 1)->get()->isEmpty()) {
            DB::table('files')->insert([
                'id' => 1,
                'parent_dir' => 0,
                'filepath' => '/',
                'size' => 0,
                'mimetype' => 'dir',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ]);
        }

        if (DB::table('files')->where('filepath', '/tmux.conf')->get()->isEmpty()) {
            DB::table('files')->insert([
                'parent_dir' => 1,
                'filepath' => '/tmux.conf',
                'size' => 804,
                'mimetype' => 'text/plain',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ]);
        }

        if (DB::table('files')->where('filepath', '/trini.jpg')->get()->isEmpty()) {
            DB::table('files')->insert([
                'parent_dir' => 1,
                'filepath' => '/trini.jpg',
                'size' => 2556959,
                'mimetype' => 'image/jpeg',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ]);
        }

        $testDir = DB::table('files')->where('filepath', '/test-dir/')->first();

        if (is_null($testDir)) {
            $testDirId = DB::table('files')->insertGetId([
                'parent_dir' => 1,
                'filepath' => '/test-dir',
                'size' => 4096,
                'mimetype' => 'dir',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ]);
        } else {
            $testDirId = $testDir->id;
        }

        $hola = DB::table('files')->where('filepath', '/test-dir/hola.txt')->first();
        
        if (is_null($hola)) {
            DB::table('files')->insert([
                'parent_dir' => $testDirId,
                'filepath' => '/test-dir/hola.txt',
                'size' => 16,
                'mimetype' => 'text/plain',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ]);
        } else if ($hola->parent_dir != $testDirId) {
            DB::table('files')->where('id', $hola->id)->delete();

            DB::table('files')->insert([
                'parent_dir' => $testDirId,
                'filepath' => '/test-dir/hola.txt',
                'size' => 16,
                'mimetype' => 'text/plain',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ]);
        }
    }
}
