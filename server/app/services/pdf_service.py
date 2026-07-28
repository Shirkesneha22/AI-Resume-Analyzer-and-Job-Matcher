import io
import pdfplumber
import fitz  # PyMuPDF
from fastapi import HTTPException

class PDFService:
    @staticmethod
    def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
        """
        Extract text from PDF in-memory.
        Uses pdfplumber first, falls back to PyMuPDF (fitz).
        """
        if not pdf_bytes or len(pdf_bytes) == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")

        extracted_text = ""
        
        # 1. Try pdfplumber
        try:
            with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
                for page in pdf.pages:
                    text = page.extract_text()
                    if text:
                        extracted_text += text + "\n"
        except Exception as e:
            # pdfplumber failed, will attempt PyMuPDF fallback
            extracted_text = ""

        # 2. Fallback to PyMuPDF (fitz) if pdfplumber extracted nothing or threw an error
        if not extracted_text.strip():
            try:
                doc = fitz.open(stream=pdf_bytes, filetype="pdf")
                for page in doc:
                    extracted_text += page.get_text() + "\n"
                doc.close()
            except Exception as e:
                raise HTTPException(
                    status_code=422, 
                    detail="Failed to extract text from PDF. The file may be corrupt, password-protected, or invalid."
                )

        clean_result = extracted_text.strip()
        if not clean_result:
            raise HTTPException(
                status_code=422,
                detail="No readable text found in PDF. The document may be an image-only scan or empty."
            )

        return clean_result

pdf_service = PDFService()
