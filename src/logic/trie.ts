export class TrieNode {
    public children: Map<string, TrieNode> = new Map<string, TrieNode>();
    public isEndOfWord: boolean = false;
}

export class Trie {
    public root: TrieNode = new TrieNode();

    public insert(word: string): void {
        let current = this.root;
        for (const ch of word) {
            if (!current.children.has(ch)) {
                current.children.set(ch, new TrieNode());
            }
            current = current.children.get(ch)!;
        }
        current.isEndOfWord = true;
    }

    public search(word: string): boolean {
        let current = this.root;
        for (const ch of word) {
            const node = current.children.get(ch);
            if (!node) {
                return false;
            }
            current = node;
        }
        return current.isEndOfWord;
    }

    public startsWith(prefix: string): boolean {
        let current = this.root;
        for (const ch of prefix) {
            const node = current.children.get(ch);
            if (!node) {
                return false;
            }
            current = node;
        }
        return true;
    }

    public nextChars(prefix: string): string[] {
        let current = this.root;
        for (const ch of prefix) {
            const node = current.children.get(ch);
            if (!node) {
                return [];
            }
            current = node;
        }
        return Array.from(current.children.keys());
    }

    public startsWithPrefix(prefix: string): string[] {
        let current = this.root;
        for (const ch of prefix) {
            const node = current.children.get(ch);
            if (!node) {
                return [];
            }
            current = node;
        }
        return this.searchAllWords(current, prefix);
    }

    private searchAllWords(node: TrieNode, prefix: string): string[] {
        const words = [];
        if (node.isEndOfWord) {
            words.push(prefix);
        }

        node.children.forEach((child, ch) => {
            words.push(...this.searchAllWords(child, prefix + ch));
        });
        return words;
    }
}

export function buildTrie(words: string[]): Trie {
    const trie = new Trie();
    words.forEach(word => trie.insert(word));
    return trie;
}