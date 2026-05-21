'use client';

import { useEffect, useMemo, useState } from 'react';
import { AdminContentCard, AdminPageContainer } from '@/shared/components/admin/layout';
import { LocalPagination } from '@/shared/components/admin/local-pagination';
import { UnitOfQuantity } from '../../models';
import UnitOfQuantityService from '../../services/unit-of-quantity-services';
import { UnitOfQuantityForm } from './unit-of-quantity-form';
import { UnitOfQuantityHeader } from './unit-of-quantity-header';
import { UnitOfQuantityStats } from './unit-of-quantity-stats';
import { UnitOfQuantityTable } from './unit-of-quantity-table';

export default function UnitOfQuantityManagement() {
  const [allUnits, setAllUnits] = useState<UnitOfQuantity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<UnitOfQuantity | null>(null);
  const pageSize = 8;

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      try {
        const response = await UnitOfQuantityService.getAll();
        if (isMounted && response) {
          setAllUnits(response);
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
      const response = await UnitOfQuantityService.getAll();
      if (response) {
        setAllUnits(response);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredUnits = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return allUnits.filter(item => {
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
  }, [activeTab, allUnits, searchTerm]);

  const totalPages = Math.ceil(filteredUnits.length / pageSize);
  const paginatedUnits = filteredUnits.slice(
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
    setSelectedUnit(null);
    setIsFormOpen(true);
  };

  const openEditModal = (unit: UnitOfQuantity) => {
    setSelectedUnit(unit);
    setIsFormOpen(true);
  };

  return (
    <AdminPageContainer>
      <UnitOfQuantityStats
        units={allUnits}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      <AdminContentCard>
        <UnitOfQuantityHeader
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onCreateClick={openCreateModal}
        />
        <div className="min-h-0 flex-1 overflow-y-auto">
          <UnitOfQuantityTable
            loading={loading}
            units={paginatedUnits}
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
      <UnitOfQuantityForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        unit={selectedUnit}
        onSuccess={fetchData}
      />
    </AdminPageContainer>
  );
}
