import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import PageLayout from './components/layout/PageLayout';
import Spinner from './components/ui/Spinner';

const Home = lazy(() => import('./pages/Home'));
const NotFound = lazy(() => import('./pages/NotFound'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
import ScrollToTop from './components/layout/ScrollToTop';

// Image tools
const ImageCompress = lazy(() => import('./pages/tools/image/Compress'));
const ImageResize = lazy(() => import('./pages/tools/image/Resize'));
const ImageCrop = lazy(() => import('./pages/tools/image/Crop'));
const JpgToPng = lazy(() => import('./pages/tools/image/JpgToPng'));
const PngToJpg = lazy(() => import('./pages/tools/image/PngToJpg'));
const WebpConverter = lazy(() => import('./pages/tools/image/WebpConverter'));
const HeicConverter = lazy(() => import('./pages/tools/image/HeicConverter'));
const ImageToPdf = lazy(() => import('./pages/tools/image/ImageToPdf'));

// PDF tools
const PdfToImages = lazy(() => import('./pages/tools/pdf/PdfToImages'));
const PdfMerge = lazy(() => import('./pages/tools/pdf/Merge'));
const PdfSplit = lazy(() => import('./pages/tools/pdf/Split'));
const PdfRotate = lazy(() => import('./pages/tools/pdf/Rotate'));
const PdfCompress = lazy(() => import('./pages/tools/pdf/Compress'));
const PdfRemovePages = lazy(() => import('./pages/tools/pdf/RemovePages'));
const PdfPageNumbering = lazy(() => import('./pages/tools/pdf/PageNumbering'));

// Other tools
const PassportPhoto = lazy(() => import('./pages/tools/other/PassportPhoto'));
const SignatureMaker = lazy(() => import('./pages/tools/other/SignatureMaker'));

export default function App() {
  return (
    <PageLayout>
      <ScrollToTop />
      <Suspense fallback={
        <div className="flex h-[50vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      }>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools" element={<CategoryPage />} />
          <Route path="/image" element={<CategoryPage category="image" />} />
          <Route path="/pdf" element={<CategoryPage category="pdf" />} />
          
          <Route path="/image/compress" element={<ImageCompress />} />
          <Route path="/image/resize" element={<ImageResize />} />
          <Route path="/image/crop" element={<ImageCrop />} />
          <Route path="/image/jpg-to-png" element={<JpgToPng />} />
          <Route path="/image/png-to-jpg" element={<PngToJpg />} />
          <Route path="/image/webp-converter" element={<WebpConverter />} />
          <Route path="/image/heic-converter" element={<HeicConverter />} />
          <Route path="/image/image-to-pdf" element={<ImageToPdf />} />

          <Route path="/pdf/pdf-to-image" element={<PdfToImages />} />
          <Route path="/pdf/merge" element={<PdfMerge />} />
          <Route path="/pdf/split" element={<PdfSplit />} />
          <Route path="/pdf/rotate" element={<PdfRotate />} />
          <Route path="/pdf/compress" element={<PdfCompress />} />
          <Route path="/pdf/remove-pages" element={<PdfRemovePages />} />
          <Route path="/pdf/page-numbering" element={<PdfPageNumbering />} />

          <Route path="/other/passport-photo" element={<PassportPhoto />} />
          <Route path="/other/signature-maker" element={<SignatureMaker />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </PageLayout>
  );
}
