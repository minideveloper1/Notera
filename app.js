/**
 * NOTERA - Modern Not Alma Uygulaması
 * JavaScript Ana Dosyası
 */

// ==== GLOBAL DEĞİŞKENLER ====
let notes = [];
let currentNoteId = null;
let isAutoSaving = false;
let searchTimeout = null;

// DOM Elementleri
const elements = {
    // Tema
    themeToggle: null,
    
    // Arama
    searchInput: null,
    clearSearch: null,
    
    // Not Listesi
    notesList: null,
    notesCount: null,
    noNotes: null,
    
    // Not Editörü
    welcomeScreen: null,
    noteEditor: null,
    noteTitle: null,
    noteContent: null,
    saveBtn: null,
    deleteBtn: null,
    newNoteBtn: null,
    
    // Meta Bilgiler
    createdDate: null,
    modifiedDate: null,
    charCount: null,
    wordCount: null,
    
    // Modal
    deleteModal: null,
    cancelDelete: null,
    confirmDelete: null,
    
    // Bildirim
    notificationContainer: null
};

// ==== UYGULAMA BAŞLATMA ====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Uygulamayı başlatır ve tüm event listener'ları kurar
 */
function initializeApp() {
    console.log('🚀 Notera başlatılıyor...');
    
    // DOM elementlerini al
    getDOMElements();
    
    // Event listener'ları kur
    setupEventListeners();
    
    // Temayı yükle
    loadTheme();
    
    // Notları yükle
    loadNotes();
    
    // Hoş geldin ekranını göster
    showWelcomeScreen();
    
    console.log('✅ Notera başarıyla başlatıldı!');
}

/**
 * Tüm DOM elementlerini alır
 */
function getDOMElements() {
    elements.themeToggle = document.getElementById('themeToggle');
    elements.searchInput = document.getElementById('searchInput');
    elements.clearSearch = document.getElementById('clearSearch');
    elements.notesList = document.getElementById('notesList');
    elements.notesCount = document.getElementById('notesCount');
    elements.noNotes = document.getElementById('noNotes');
    elements.welcomeScreen = document.getElementById('welcomeScreen');
    elements.noteEditor = document.getElementById('noteEditor');
    elements.noteTitle = document.getElementById('noteTitle');
    elements.noteContent = document.getElementById('noteContent');
    elements.saveBtn = document.getElementById('saveBtn');
    elements.deleteBtn = document.getElementById('deleteBtn');
    elements.newNoteBtn = document.getElementById('newNoteBtn');
    elements.createdDate = document.getElementById('createdDate');
    elements.modifiedDate = document.getElementById('modifiedDate');
    elements.charCount = document.getElementById('charCount');
    elements.wordCount = document.getElementById('wordCount');
    elements.deleteModal = document.getElementById('deleteModal');
    elements.cancelDelete = document.getElementById('cancelDelete');
    elements.confirmDelete = document.getElementById('confirmDelete');
    elements.notificationContainer = document.getElementById('notificationContainer');
}

/**
 * Tüm event listener'ları kurar
 */
function setupEventListeners() {
    // Tema değiştirme
    elements.themeToggle.addEventListener('click', toggleTheme);
    
    // Arama
    elements.searchInput.addEventListener('input', handleSearch);
    elements.clearSearch.addEventListener('click', clearSearch);
    
    // Not işlemleri
    elements.newNoteBtn.addEventListener('click', createNewNote);
    elements.saveBtn.addEventListener('click', saveCurrentNote);
    elements.deleteBtn.addEventListener('click', showDeleteModal);
    
    // Not editörü
    elements.noteTitle.addEventListener('input', handleNoteChange);
    elements.noteContent.addEventListener('input', handleNoteChange);
    elements.noteContent.addEventListener('input', updateWordCount);
    
    // Modal işlemleri
    elements.cancelDelete.addEventListener('click', hideDeleteModal);
    elements.confirmDelete.addEventListener('click', deleteCurrentNote);
    elements.deleteModal.addEventListener('click', function(e) {
        if (e.target === elements.deleteModal) {
            hideDeleteModal();
        }
    });
    
    // Klavye kısayolları
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Sayfa kapatılmadan önce kaydet
    window.addEventListener('beforeunload', function(e) {
        if (currentNoteId && hasUnsavedChanges()) {
            saveCurrentNote();
        }
    });
}

/**
 * Klavye kısayollarını yönetir
 */
function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + N: Yeni not
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        createNewNote();
    }
    
    // Ctrl/Cmd + S: Kaydet
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveCurrentNote();
    }
    
    // Ctrl/Cmd + F: Arama odakla
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        elements.searchInput.focus();
    }
    
    // Ctrl/Cmd + T: Tema değiştir
    if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        toggleTheme();
    }
    
    // Delete: Not sil (sadece not listesinde)
    if (e.key === 'Delete' && e.target.classList.contains('note-item')) {
        e.preventDefault();
        showDeleteModal();
    }
}

// ==== TEMA YÖNETİMİ ====

/**
 * Temayı değiştirir
 */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    updateThemeIcon(newTheme);
    saveTheme(newTheme);
    
    showNotification(`${newTheme === 'dark' ? 'Karanlık' : 'Aydınlık'} tema aktif edildi`, 'success');
}

/**
 * Tema ikonunu günceller
 */
function updateThemeIcon(theme) {
    const icon = elements.themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

/**
 * Temayı localStorage'a kaydeder
 */
function saveTheme(theme) {
    localStorage.setItem('notera-theme', theme);
}

/**
 * Temayı localStorage'dan yükler
 */
function loadTheme() {
    const savedTheme = localStorage.getItem('notera-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

// ==== NOT YÖNETİMİ ====

/**
 * Yeni not oluşturur
 */
function createNewNote() {
    const newNote = {
        id: generateId(),
        title: '',
        content: '',
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString()
    };
    
    notes.unshift(newNote);
    saveNotes();
    renderNotesList();
    selectNote(newNote.id);
    
    // Başlık alanına odaklan
    setTimeout(() => {
        elements.noteTitle.focus();
    }, 100);
    
    showNotification('Yeni not oluşturuldu', 'success');
}

/**
 * Not seçer ve editörde gösterir
 */
function selectNote(noteId) {
    currentNoteId = noteId;
    const note = notes.find(n => n.id === noteId);
    
    if (!note) {
        showWelcomeScreen();
        return;
    }
    
    // Aktif not class'ını güncelle
    document.querySelectorAll('.note-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const noteElement = document.querySelector(`[data-note-id="${noteId}"]`);
    if (noteElement) {
        noteElement.classList.add('active');
    }
    
    // Not editörünü göster
    showNoteEditor(note);
    updateWordCount();
}

/**
 * Not editörünü gösterir
 */
function showNoteEditor(note) {
    elements.welcomeScreen.style.display = 'none';
    elements.noteEditor.style.display = 'flex';
    
    elements.noteTitle.value = note.title || '';
    elements.noteContent.value = note.content || '';
    
    // Tarih bilgilerini güncelle
    elements.createdDate.textContent = formatDate(note.createdAt);
    elements.modifiedDate.textContent = formatDate(note.modifiedAt);
}

/**
 * Hoş geldin ekranını gösterir
 */
function showWelcomeScreen() {
    currentNoteId = null;
    elements.welcomeScreen.style.display = 'flex';
    elements.noteEditor.style.display = 'none';
}

/**
 * Mevcut notu kaydeder
 */
function saveCurrentNote() {
    if (!currentNoteId) return;
    
    const note = notes.find(n => n.id === currentNoteId);
    if (!note) return;
    
    const title = elements.noteTitle.value.trim();
    const content = elements.noteContent.value.trim();
    
    // Boş not kontrolü
    if (!title && !content) {
        showNotification('Boş not kaydedilemez', 'warning');
        return;
    }
    
    // Notu güncelle
    note.title = title || 'Başlıksız Not';
    note.content = content;
    note.modifiedAt = new Date().toISOString();
    
    // Kaydet ve görünümü güncelle
    saveNotes();
    renderNotesList();
    elements.modifiedDate.textContent = formatDate(note.modifiedAt);
    
    // Kaydetme animasyonu
    elements.saveBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        elements.saveBtn.style.transform = 'scale(1)';
    }, 150);
    
    showNotification('Not kaydedildi', 'success');
}

/**
 * Not değişikliklerini izler ve otomatik kaydet
 */
function handleNoteChange() {
    if (!currentNoteId || isAutoSaving) return;
    
    // Debounce ile otomatik kaydetme (2 saniye sonra)
    clearTimeout(window.autoSaveTimeout);
    window.autoSaveTimeout = setTimeout(() => {
        isAutoSaving = true;
        saveCurrentNote();
        isAutoSaving = false;
    }, 2000);
}

/**
 * Kelime ve karakter sayısını günceller
 */
function updateWordCount() {
    const content = elements.noteContent.value;
    const charCount = content.length;
    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
    
    elements.charCount.textContent = charCount.toLocaleString();
    elements.wordCount.textContent = wordCount.toLocaleString();
}

/**
 * Silme modalını gösterir
 */
function showDeleteModal() {
    if (!currentNoteId) return;
    elements.deleteModal.style.display = 'flex';
}

/**
 * Silme modalını gizler
 */
function hideDeleteModal() {
    elements.deleteModal.style.display = 'none';
}

/**
 * Mevcut notu siler
 */
function deleteCurrentNote() {
    if (!currentNoteId) return;
    
    const noteIndex = notes.findIndex(n => n.id === currentNoteId);
    if (noteIndex === -1) return;
    
    const note = notes[noteIndex];
    notes.splice(noteIndex, 1);
    
    saveNotes();
    renderNotesList();
    hideDeleteModal();
    showWelcomeScreen();
    
    showNotification(`"${note.title || 'Başlıksız Not'}" silindi`, 'success');
}

// ==== ARAMA İŞLEVLERİ ====

/**
 * Arama işlemini yönetir
 */
function handleSearch() {
    const query = elements.searchInput.value.trim();
    
    // Clear button'u göster/gizle
    elements.clearSearch.style.display = query ? 'block' : 'none';
    
    // Debounce ile arama
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        filterNotes(query);
    }, 300);
}

/**
 * Aramayı temizler
 */
function clearSearch() {
    elements.searchInput.value = '';
    elements.clearSearch.style.display = 'none';
    filterNotes('');
    elements.searchInput.focus();
}

/**
 * Notları filtreler
 */
function filterNotes(query) {
    const noteItems = document.querySelectorAll('.note-item');
    let visibleCount = 0;
    
    noteItems.forEach(item => {
        const title = item.querySelector('.note-item-title').textContent.toLowerCase();
        const preview = item.querySelector('.note-item-preview').textContent.toLowerCase();
        const searchQuery = query.toLowerCase();
        
        const matches = title.includes(searchQuery) || preview.includes(searchQuery);
        
        if (matches) {
            item.style.display = 'block';
            visibleCount++;
            
            // Arama terimini vurgula
            highlightSearchTerm(item, query);
        } else {
            item.style.display = 'none';
        }
    });
    
    // Boş durum mesajını göster/gizle
    const hasNotes = notes.length > 0;
    const hasVisibleNotes = visibleCount > 0;
    
    if (hasNotes && !hasVisibleNotes && query) {
        showNoSearchResults(query);
    } else if (!hasNotes) {
        elements.noNotes.style.display = 'block';
    } else {
        elements.noNotes.style.display = 'none';
    }
}

/**
 * Arama sonucu bulunamadığında mesaj gösterir
 */
function showNoSearchResults(query) {
    elements.noNotes.style.display = 'block';
    elements.noNotes.innerHTML = `
        <i class="fas fa-search"></i>
        <p>"${query}" için sonuç bulunamadı</p>
        <small>Farklı anahtar kelimeler deneyin</small>
    `;
}

/**
 * Arama terimini vurgular
 */
function highlightSearchTerm(item, query) {
    if (!query) return;
    
    const title = item.querySelector('.note-item-title');
    const preview = item.querySelector('.note-item-preview');
    
    [title, preview].forEach(element => {
        const text = element.textContent;
        const regex = new RegExp(`(${query})`, 'gi');
        const highlightedText = text.replace(regex, '<mark>$1</mark>');
        
        if (highlightedText !== text) {
            element.innerHTML = highlightedText;
        }
    });
}

// ==== NOT LİSTESİ RENDER ====

/**
 * Not listesini render eder
 */
function renderNotesList() {
    if (notes.length === 0) {
        elements.noNotes.style.display = 'block';
        elements.noNotes.innerHTML = `
            <i class="fas fa-sticky-note"></i>
            <p>Henüz not yok</p>
            <small>Yeni bir not oluşturmak için + butonuna tıklayın</small>
        `;
        elements.notesCount.textContent = '0';
        return;
    }
    
    elements.noNotes.style.display = 'none';
    elements.notesCount.textContent = notes.length.toString();
    
    const noteItems = notes.map(note => createNoteItemHTML(note)).join('');
    elements.notesList.innerHTML = noteItems;
    
    // Event listener'ları ekle
    document.querySelectorAll('.note-item').forEach(item => {
        item.addEventListener('click', () => {
            const noteId = item.dataset.noteId;
            selectNote(noteId);
        });
    });
}

/**
 * Tek not item HTML'i oluşturur
 */
function createNoteItemHTML(note) {
    const title = note.title || 'Başlıksız Not';
    const preview = note.content ? 
        note.content.substring(0, 100).replace(/\n/g, ' ') : 
        'İçerik yok...';
    const date = formatRelativeDate(note.modifiedAt);
    const isActive = currentNoteId === note.id ? 'active' : '';
    
    return `
        <div class="note-item ${isActive}" data-note-id="${note.id}">
            <div class="note-item-title">${escapeHtml(title)}</div>
            <div class="note-item-preview">${escapeHtml(preview)}</div>
            <div class="note-item-date">${date}</div>
        </div>
    `;
}

// ==== YARDIMCI FONKSİYONLAR ====

/**
 * Benzersiz ID oluşturur
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Tarihi formatlar
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Göreceli tarih formatlar (örn: "2 saat önce")
 */
function formatRelativeDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Şimdi';
    if (minutes < 60) return `${minutes} dakika önce`;
    if (hours < 24) return `${hours} saat önce`;
    if (days < 7) return `${days} gün önce`;
    
    return date.toLocaleDateString('tr-TR');
}

/**
 * HTML escape işlemi
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Kaydedilmemiş değişiklik var mı kontrol eder
 */
function hasUnsavedChanges() {
    if (!currentNoteId) return false;
    
    const note = notes.find(n => n.id === currentNoteId);
    if (!note) return false;
    
    const currentTitle = elements.noteTitle.value.trim();
    const currentContent = elements.noteContent.value.trim();
    
    return note.title !== currentTitle || note.content !== currentContent;
}

// ==== VERI YÖNETİMİ ====

/**
 * Notları localStorage'a kaydeder
 */
function saveNotes() {
    try {
        localStorage.setItem('notera-notes', JSON.stringify(notes));
    } catch (error) {
        console.error('Notlar kaydedilemedi:', error);
        showNotification('Notlar kaydedilemedi!', 'error');
    }
}

/**
 * Notları localStorage'dan yükler
 */
function loadNotes() {
    try {
        const saved = localStorage.getItem('notera-notes');
        if (saved) {
            notes = JSON.parse(saved);
            renderNotesList();
        }
    } catch (error) {
        console.error('Notlar yüklenemedi:', error);
        showNotification('Notlar yüklenemedi!', 'error');
        notes = [];
    }
}

// ==== BİLDİRİM SİSTEMİ ====

/**
 * Bildirim gösterir
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <i class="${icons[type] || icons.info}"></i>
        <span>${message}</span>
    `;
    
    elements.notificationContainer.appendChild(notification);
    
    // Animasyon
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Otomatik kaldırma
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// ==== ELECTRON IPC OLAYLARI ====
if (typeof require !== 'undefined') {
    const { ipcRenderer } = require('electron');
    
    // Menüden gelen olayları dinle
    ipcRenderer.on('new-note', createNewNote);
    ipcRenderer.on('save-note', saveCurrentNote);
    ipcRenderer.on('toggle-theme', toggleTheme);
    ipcRenderer.on('focus-search', () => elements.searchInput.focus());
}

// ==== KONSOL MESAJLARI ====
console.log(`
🎉 Notera v1.0.0 
📝 Modern Not Alma Uygulaması

Geliştirici: Notera Team
GitHub: https://github.com/minideveloper1/notera

Klavye Kısayolları:
• Ctrl+N: Yeni Not
• Ctrl+S: Kaydet  
• Ctrl+F: Arama
• Ctrl+T: Tema Değiştir
`);