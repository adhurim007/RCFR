export interface User {
    id?: string;
    name?: string;      // keep compatibility with Fuse
    fullName?: string;
    email: string;
    avatar?: string;
    status?: string;
    roles: string[];
}
