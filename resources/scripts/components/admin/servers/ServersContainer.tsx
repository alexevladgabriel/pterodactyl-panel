import { NavLink } from 'react-router-dom';
import tw from 'twin.macro';

import FlashMessageRender from '@/components/FlashMessageRender';
import AdminContentBlock from '@/components/admin/AdminContentBlock';
import ServersTable from '@/components/admin/servers/ServersTable';
import { Button } from '@/components/elements/button';
import { PlusIcon } from '@heroicons/react/outline';

function ServersContainer() {
    return (
        <AdminContentBlock title={'Servers'}>
            <div css={tw`w-full flex flex-row items-center mb-8`}>
                <div css={tw`flex flex-col flex-shrink`} style={{ minWidth: '0' }}>
                    <h2 css={tw`text-2xl text-neutral-50 font-header font-medium`}>Servers</h2>
                    <p css={tw`text-base text-neutral-400 whitespace-nowrap overflow-ellipsis overflow-hidden`}>
                        All servers available on the system.
                    </p>
                </div>

                <div css={tw`flex ml-auto pl-4`}>
                    <NavLink to={`/admin/servers/new`}>
                        <Button className="shadow focus:ring-offset-2 focus:ring-offset-neutral-800">
                            New Server <PlusIcon className="ml-2 h-5 w-5" />
                        </Button>
                    </NavLink>
                </div>
            </div>

            <FlashMessageRender byKey={'servers'} css={tw`mb-4`} />

            <ServersTable />
        </AdminContentBlock>
    );
}

export default ServersContainer;
