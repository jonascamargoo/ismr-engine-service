export class User {
    id: string;
    display_name: string;
    username: string;
    password: string;
    datetime: Date | null;

    constructor(id?: string, display_name?: string, username?: string, password?: string, datetime?: Date) {
        this.id = String(id || null);
        this.display_name = String(display_name || null);
        this.username = String(username || null);
        this.password = String(password || null);
        this.datetime = datetime || null;
    }
}

