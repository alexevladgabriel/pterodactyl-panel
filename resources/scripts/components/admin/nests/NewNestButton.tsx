import type { FormikHelpers } from 'formik';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import tw from 'twin.macro';
import { object, string } from 'yup';

import createNest from '@/api/admin/nests/createNest';
import getNests from '@/api/admin/nests/getNests';
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
    name: string;
    description: string;
}

const schema = object().shape({
    name: string().required('A nest name must be provided.').max(32, 'Nest name must not exceed 32 characters.'),
    description: string().max(255, 'Nest description must not exceed 255 characters.'),
});

export default () => {
    const [visible, setVisible] = useState(false);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const { mutate } = getNests();

    const submit = ({ name, description }: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes('nest:create');
        setSubmitting(true);

        createNest(name, description)
            .then(async nest => {
                await mutate(data => ({ ...data!, items: data!.items.concat(nest) }), false);
                setVisible(false);
            })
            .catch(error => {
                clearAndAddHttpError({ key: 'nest:create', error });
                setSubmitting(false);
            });
    };

    return (
        <Formik onSubmit={submit} initialValues={{ name: '', description: '' }} validationSchema={schema}>
            {({ resetForm }) => (
                <Dialog
                    open={visible}
                    onOpenChange={open => {
                        setVisible(open);
                        resetForm();
                        clearFlashes('nest:create');
                    }}
                >
                    <DialogTrigger asChild>
                        <Button className="shadow focus:ring-offset-2 focus:ring-offset-neutral-800">
                            New Nest <PlusIcon className="ml-2 h-5 w-5" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[800px] gap-6">
                        <DialogHeader>
                            <DialogTitle className="text-2xl text-neutral-100">New Nest</DialogTitle>
                        </DialogHeader>
                        <Form css={tw`m-0`}>
                            <FlashMessageRender byKey={'nest:create'} css={tw`mb-3`} />

                            <Field
                                type={'text'}
                                id={'name'}
                                name={'name'}
                                label={'Name'}
                                description={'A short name used to identify this nest.'}
                                autoFocus
                            />

                            <div css={tw`mt-6`}>
                                <Field
                                    type={'text'}
                                    id={'description'}
                                    name={'description'}
                                    label={'Description'}
                                    description={'A description for this nest.'}
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
                                    Create Nest
                                </Button>
                            </DialogFooter>
                        </Form>
                    </DialogContent>
                </Dialog>
            )}
        </Formik>
    );
};
