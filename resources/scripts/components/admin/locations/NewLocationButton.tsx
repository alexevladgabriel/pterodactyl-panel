import type { FormikHelpers } from 'formik';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import tw from 'twin.macro';
import { object, string } from 'yup';

import createLocation from '@/api/admin/locations/createLocation';
import getLocations from '@/api/admin/locations/getLocations';
import { Button } from '@/components/elements/button';
import { Variant } from '@/components/elements/button/types';
import Field from '@/components/elements/Field';
import FlashMessageRender from '@/components/FlashMessageRender';
import useFlash from '@/plugins/useFlash';
import { PlusIcon } from '@heroicons/react/outline';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/elements/ui/dialog';

interface Values {
    short: string;
    long: string;
}

const schema = object().shape({
    short: string()
        .required('A location short name must be provided.')
        .max(32, 'Location short name must not exceed 32 characters.'),
    long: string().max(255, 'Location long name must not exceed 255 characters.'),
});

export default () => {
    const [visible, setVisible] = useState(false);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const { mutate } = getLocations();

    const submit = ({ short, long }: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes('location:create');
        setSubmitting(true);

        createLocation(short, long)
            .then(async location => {
                await mutate(data => ({ ...data!, items: data!.items.concat(location) }), false);
                setVisible(false);
            })
            .catch(error => {
                clearAndAddHttpError({ key: 'location:create', error });
                setSubmitting(false);
            });
    };

    return (
        <Formik onSubmit={submit} initialValues={{ short: '', long: '' }} validationSchema={schema}>
            {({ resetForm }) => (
                <Dialog
                    open={visible}
                    onOpenChange={open => {
                        setVisible(open);
                        resetForm();
                        clearFlashes('location:create');
                    }}
                >
                    <DialogTrigger asChild>
                        <Button className="shadow focus:ring-offset-2 focus:ring-offset-neutral-800">
                            New Location <PlusIcon className="ml-2 h-5 w-5" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[800px] gap-6">
                        <DialogHeader>
                            <DialogTitle className="text-2xl text-neutral-100">New Location</DialogTitle>
                        </DialogHeader>
                        <Form css={tw`m-0`}>
                            <FlashMessageRender byKey={'location:create'} css={tw`mb-3`} />
                            <Field
                                type={'text'}
                                id={'short'}
                                name={'short'}
                                label={'Short'}
                                description={'A short name used to identify this location.'}
                                autoFocus
                            />

                            <div css={tw`mt-6`}>
                                <Field
                                    type={'text'}
                                    id={'long'}
                                    name={'long'}
                                    label={'Long'}
                                    description={'A long name for this location.'}
                                />
                            </div>
                            <DialogFooter>
                                <Button.Text
                                    type="button"
                                    variant={Variant.Secondary}
                                    css={tw`w-full sm:w-auto sm:mr-2`}
                                    onClick={() => setVisible(false)}
                                >
                                    Cancel
                                </Button.Text>
                                <Button type={'submit'} css={tw`w-full mt-4 sm:w-auto sm:mt-0`}>
                                    Create Location
                                </Button>
                            </DialogFooter>
                        </Form>
                    </DialogContent>
                </Dialog>
            )}
        </Formik>
    );
};
