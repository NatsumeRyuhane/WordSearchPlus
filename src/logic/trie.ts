class TrieNode {
    public children: Map<string, TrieNode>;
    public isEndOfWord: boolean;

    constructor() {
        this.children = new Map<string, TrieNode>();
        this.isEndOfWord = false;
    }
}

class Trie {
    public root: TrieNode;

    constructor() {
        this.root = new TrieNode();
    }

    public insert(word: string) {
        let current = this.root;
        for (let i = 0; i < word.length; i++) {
            let ch = word.charAt(i);
            let node = current.children.get(ch);
            if (node == null) {
                node = new TrieNode();
                current.children.set(ch, node);
            }
            current = node;
        }
        current.isEndOfWord = true;
    }

    public search(word: string): boolean {
        let current = this.root;
        for (let i = 0; i < word.length; i++) {
            let ch = word.charAt(i);
            let node = current.children.get(ch);
            if (node == null) {
                return false;
            }
            current = node;
        }
        return current.isEndOfWord;
    }
}