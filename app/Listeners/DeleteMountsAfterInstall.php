<?php

namespace Pterodactyl\Listeners;

use Pterodactyl\Models\EggMount;
use Pterodactyl\Models\Mount;
use Pterodactyl\Models\MountServer;

class DeleteMountsAfterInstall
{
    /**
     * Handle the event.
     */
    public function handle($event): void
    {
        $egg_mounts = EggMount::where('egg_id', '=', $event->server->egg_id)->get()->pluck('mount_id');
        $mounts = Mount::whereIn('id', $egg_mounts)->where([
            ['mount_on_install', '=', true],
            ['auto_mount', '=', false],
        ])->get();

        foreach ($mounts as $mount) {
            MountServer::where('mount_id', $mount->id)->where('server_id', $event->server->id)->delete();
        }
    }
}
