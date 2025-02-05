// Fetch and insert chapter content
async function loadChapterContent() {
    const chapters = {
        'chapter1': '../stories/skyggespillet_chapter1.md',
        'chapter2': '../stories/skyggespillet_chapter2.md',
        'chapter3': '../stories/skyggespillet_chapter3.md'
    };

    for (const [id, path] of Object.entries(chapters)) {
        try {
            const response = await fetch(path);
            const content = await response.text();
            document.querySelector(`#${id} .chapter-content`).innerHTML = marked(content);
        } catch (error) {
            console.error(`Error loading chapter ${id}:`, error);
        }
    }
}

// Load chapter content when the page is ready
document.addEventListener('DOMContentLoaded', loadChapterContent);
