export class Preferences {
    ai_personality: string;
    read_only_headphones: string;
    focus_mode_active: string;
    hide_sensitive_data: string;

    constructor(ai_personality?: string, read_only_headphones?: string, focus_mode_active?: string, hide_sensitive_data?: string) {
        this.ai_personality = String(ai_personality || null);
        this.read_only_headphones = String(read_only_headphones || null);
        this.focus_mode_active = String(focus_mode_active || null);
        this.hide_sensitive_data = String(hide_sensitive_data || null);
    }
}

