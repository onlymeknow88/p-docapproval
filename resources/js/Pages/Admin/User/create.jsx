import { Button } from '@/Components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function Create({ data, setData, handleSubmit }) {
    return (
        <>
            <div className="grid gap-4">
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="name">Nama</Label>
                        <Input
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full"
                            autoComplete="name"
                            isFocused={true}
                            placeholder="Jhon Doe Example"
                            onChange={(e) => setData(e.target.name, e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            type="text"
                            name="username"
                            value={data.username}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            isFocused={true}
                            placeholder="jdoe example"
                            onChange={(e) => setData(e.target.name, e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="email"
                            isFocused={true}
                            placeholder="a@example.com"
                            onChange={(e) => setData(e.target.name, e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            isFocused={true}
                            onChange={(e) => setData(e.target.name, e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className="flex justify-end mt-4">
                <Button type="button" variant="orange" onClick={handleSubmit}>
                    Submit
                </Button>
            </div>
        </>
    );
}
