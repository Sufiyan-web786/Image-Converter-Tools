// Global variables
let currentTool = null;
let originalFile = null;
let processedFile = null;

// Tool selection function
function selectTool(tool) {
    currentTool = tool;
    const toolNames = {
        'jpg-to-png': 'JPG to PNG Converter',
        'png-to-jpg': 'PNG to JPG Converter',
        'webp-convert': 'WebP Converter',
        'compress': 'Image Compressor',
        'resize': 'Image Resizer'
    };
    
    document.getElementById('converter-title').textContent = toolNames[tool];
    document.getElementById('converter-description').textContent = 'Convert your images using our ' + toolNames[tool];
    
    // Scroll to converter section
    document.getElementById('converter').scrollIntoView({ behavior: 'smooth' });
    
    // Reset UI
    document.getElementById('uploadBox').style.display = 'block';
    document.getElementById('optionsBox').style.display = 'none';
    document.getElementById('progressContainer').style.display = 'none';
    document.getElementById('downloadBox').style.display = 'none';
}

// File size formatting function
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Tool selection buttons
    document.querySelectorAll('.use-tool').forEach(button => {
        button.addEventListener('click', function() {
            const tool = this.closest('.tool-card').getAttribute('data-tool');
            selectTool(tool);
        });
    });

    // File upload handling
    document.getElementById('browseBtn').addEventListener('click', function() {
        document.getElementById('fileInput').click();
    });

    document.getElementById('fileInput').addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            originalFile = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = function(event) {
                document.getElementById('imagePreview').src = event.target.result;
                document.getElementById('uploadBox').style.display = 'none';
                document.getElementById('optionsBox').style.display = 'flex';
                
                // Show original file size
                document.getElementById('originalSize').textContent = formatFileSize(originalFile.size);
            };
            
            reader.readAsDataURL(originalFile);
        }
    });

    // Process button handling
    document.getElementById('processBtn').addEventListener('click', function() {
        if (!originalFile) return;
        
        document.getElementById('optionsBox').style.display = 'none';
        document.getElementById('progressContainer').style.display = 'block';
        
        // Simulate processing
        let progress = 0;
        const interval = setInterval(function() {
            progress += Math.random() * 10;
            if (progress > 100) progress = 100;
            
            document.getElementById('progressBar').style.width = progress + '%';
            document.getElementById('progressText').textContent = Math.round(progress) + '% Complete';
            
            if (progress === 100) {
                clearInterval(interval);
                setTimeout(function() {
                    // Calculate file sizes (in real app these would be actual values)
                    const originalSizeBytes = originalFile.size;
                    const convertedSizeBytes = Math.round(originalSizeBytes * 0.7); // Simulate 30% reduction
                    const savedBytes = originalSizeBytes - convertedSizeBytes;
                    const savedPercentage = Math.round((savedBytes / originalSizeBytes) * 100);
                    
                    document.getElementById('convertedSize').textContent = formatFileSize(convertedSizeBytes);
                    document.getElementById('savedSize').textContent = formatFileSize(savedBytes);
                    document.getElementById('savedPercent').textContent = savedPercentage + '%';
                    
                    document.getElementById('progressContainer').style.display = 'none';
                    document.getElementById('downloadBox').style.display = 'block';
                    document.getElementById('resultPreview').src = document.getElementById('imagePreview').src;
                }, 500);
            }
        }, 200);
    });

    // Download button handling
    document.getElementById('downloadBtn').addEventListener('click', function() {
        if (!document.getElementById('resultPreview').src) return;
        
        const link = document.createElement('a');
        link.href = document.getElementById('resultPreview').src;
        
        // Set appropriate file extension
        let extension = 'jpg';
        if (currentTool === 'jpg-to-png') extension = 'png';
        else if (currentTool === 'webp-convert') extension = 'webp';
        
        link.download = `converted-image.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // New file button handling
    document.getElementById('newFileBtn').addEventListener('click', function() {
        document.getElementById('fileInput').value = '';
        document.getElementById('downloadBox').style.display = 'none';
        document.getElementById('uploadBox').style.display = 'block';
    });
});
