'use client';

import { useEffect, useMemo, useState } from 'react';
import { AdminContentCard, AdminPageContainer } from '@/shared/components/admin/layout';
import { LocalPagination } from '@/shared/components/admin/local-pagination';
import { Supplier } from '../../models';
import SupplierService from '../../services/supplier-services';
import { SupplierForm } from './supplier-form';
import { SupplierHeader } from './supplier-header';
import { SupplierStats } from './supplier-stats';
import { SupplierTable } from './supplier-table';

export default function SupplierManagement() {
  const [allSuppliers, setAllSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const pageSize = 8;

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      try {
        const response = await SupplierService.getAll();
        if (isMounted && response) {
          setAllSuppliers(response);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await SupplierService.getAll();
      if (response) {
        setAllSuppliers(response);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredSuppliers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return allSuppliers.filter(item => {
      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'updated' && !!item.updatedAt) ||
        (activeTab === 'missing-description' && !item.description?.trim());

      if (!matchesTab) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return (
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.description?.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [activeTab, allSuppliers, searchTerm]);

  const totalPages = Math.ceil(filteredSuppliers.length / pageSize);
  const paginatedSuppliers = filteredSuppliers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const openCreateModal = () => {
    setSelectedSupplier(null);
    setIsFormOpen(true);
  };

  const openEditModal = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsFormOpen(true);
  };

  return (
    <AdminPageContainer>
      <SupplierStats
        suppliers={allSuppliers}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      <AdminContentCard>
        <SupplierHeader
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onCreateClick={openCreateModal}
        />
        <div className="min-h-0 flex-1 overflow-y-auto">
          <SupplierTable
            loading={loading}
            suppliers={paginatedSuppliers}
            onEdit={openEditModal}
            onRefresh={fetchData}
          />
        </div>
        <LocalPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </AdminContentCard>
      <SupplierForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        supplier={selectedSupplier}
        onSuccess={fetchData}
      />
    </AdminPageContainer>
  );
}
