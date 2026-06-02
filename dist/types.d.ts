export interface RepositoryRule {
    source: string;
    text: string;
}
export interface ChecklistInput {
    title: string;
    changedFiles: string[];
    rules: RepositoryRule[];
    inferredItems: string[];
}
